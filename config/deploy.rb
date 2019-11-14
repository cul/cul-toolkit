require 'rainbow'

lock "3.11.0"

set :department, 'cul'
set :application, 'toolkit'
set :remote_user, "culwcm"
set :repo_url, "git@github.com:cul/#{fetch(:department)}-#{fetch(:application)}.git"
set :deploy_to, "/wcm-local/cul-toolkit/deployments/v3"
set :ssh_options, { :forward_agent => true }
set :keep_releases, 2

set :v3_docroot, '/wcm-local/cul-toolkit/html/v3'

before 'deploy:starting', :create_tmp_dir
before 'deploy:starting', :ensure_deployment_dependencies
after 'deploy:finished', :build_dist, :symlink_v3

desc 'create tmp directory'
task :create_tmp_dir do
  on roles(:web) do
    execute :mkdir, '-p', fetch(:tmp_dir)
  end
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

desc 'run yarn build to create the dist directory'
task :build_dist do
  on roles(:web) do
    within release_path do
      execute :yarn, 'install'
      execute :yarn, 'build'
    end
  end
end

desc 'symlink v3'
task :symlink_v3 do
  on roles(:web) do
    execute :ln, '-sf', File.join(fetch(:deploy_to), 'current', 'dist'), fetch(:v3_docroot)
  end
end

def self.enter_y_to_continue(prompt)
  puts prompt
  set :confirmation_value, ask('"y" or "yes" to continue (or any other value to cancel)')
  entered_y = ['y', 'yes'].include?(fetch(:confirmation_value))
  delete :confirmation_value
  entered_y
end
