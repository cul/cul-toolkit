require 'rainbow'

lock "3.18.0"

set :application, 'cul_toolkit_v5'
set :remote_user, "culwcm"
set :repo_url, "git@github.com:cul/cul-toolkit.git"
set :deploy_to, "/wcm-local/cul-toolkit/deployments/v5"
set :ssh_options, { :forward_agent => true }
set :keep_releases, 2
set :nvm_alias, "#{fetch(:application)}_#{fetch(:stage)}"

set :v5_docroot, '/wcm-local/cul-toolkit/html/v5'

before 'deploy:starting', :create_tmp_dir
before 'deploy:starting', :ensure_deployment_dependencies
before 'deploy:symlink:release', :build_dist
after 'deploy:symlink:release', :symlink_v5

# NVM Setup, for selecting the correct node version
# NOTE: This NVM configuration MUST be configured before the RVM setup steps because:
# This works:
# nvm exec 16 ~/.rvm-alma8/bin/rvm example_app_dev do node --version
# But this does not work:
# ~/.rvm-alma8/bin/rvm example_app_dev do nvm exec 16 node --version
set :nvm_node_version, fetch(:deploy_name) # This NVM alias must exist on the server
[:rake, :node, :npm, :yarn].each do |command_to_prefix|
  SSHKit.config.command_map.prefix[command_to_prefix].push("nvm exec #{fetch(:nvm_node_version)}")
end

desc 'confirm that pre-deployment steps have been run'
task :ensure_deployment_dependencies do
  unless enter_y_to_continue(
    Rainbow("\nHave you already...\n\n").blue.bright +
    Rainbow("- (Optionally) updated the package.json version (if you want to create a versioned release) ?\n").orange.bright +
    Rainbow("- Pushed your commit ?\n").blue.bright
  )
    puts 'Cancelled because neither "y" nor "yes" were entered.'
    exit
  end

  ver = JSON.parse(IO.read(File.join(File.dirname(__FILE__), '../package.json')))['version']
  current_version_tag = "v#{ver}"
  tags = `git tag --list`.split("\n")

  unless tags.include?(current_version_tag)
    puts Rainbow("\nWarning: Current package.json version tag #{current_version_tag} was not found among existing git tags.\n").yellow.bright

    if enter_y_to_continue(Rainbow("Do you want to create and push a new tag? #{current_version_tag}\n").blue.bright)
      run_locally do
        execute :git, 'tag', current_version_tag
        execute :git, 'push', '--tags'
      end
    end
  end
end

desc 'run npm build to create the dist directory'
task :build_dist do
  # Note that the tasks below are run inside a block that uses the `in: :sequence` argument
  # because in our test and prod environments we deploy simultaneously to two load-balanced hosts
  # with a shared, network-mounted user home directory, and the npm commands generally fail when
  # running at the same time in this scenario if they're run in parallel (which would be the default).
  on roles(:web), in: :sequence do
    within release_path do
      execute :npm, 'install'
      execute :npm, 'build'
    end
  end
end

desc 'symlink v5'
task :symlink_v5 do
  on roles(:web) do
    execute :ln, '-sf', File.join(fetch(:deploy_to), 'current', 'dist'), fetch(:v5_docroot)
  end
end

def self.enter_y_to_continue(prompt)
  puts prompt
  set :confirmation_value, ask('"y" or "yes" to continue (or any other value to cancel)')
  entered_y = ['y', 'yes'].include?(fetch(:confirmation_value))
  delete :confirmation_value
  entered_y
end
