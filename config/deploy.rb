# frozen_string_literal: true

require 'rainbow'

# config valid for current version and patch releases of Capistrano
lock '~> 3.18.0'

set :remote_user, 'culwcm'
set :application, 'cul-toolkit'
set :repo_url, "git@github.com:cul/cul-toolkit.git"
set :deploy_name, "#{fetch(:application)}_#{fetch(:stage)}"

# Default deploy_to directory is /var/www/my_app_name
set :deploy_to, "/app/wcm2-local/cul-toolkit/deployments/v3"

set :v3_docroot, '/app/wcm2-local/cul-toolkit/html/v3'

# Default value for :linked_files is []
# append  :linked_files,
#         'config/example1.yml',
#         'config/example2.yml'

# Default value for linked_dirs is []
append :linked_dirs, 'log', 'tmp/pids', 'node_modules'

# Default value for keep_releases is 5
set :keep_releases, 3

# Set default log level (which can be overridden by other environments)
set :log_level, :info

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

# Default value for default_env is {}
set :default_env, NODE_ENV: 'production'

# Default branch is :master
# ask :branch, `git rev-parse --abbrev-ref HEAD`.chomp

# Default value for :scm is :git
# set :scm, :git

# Default value for :format is :airbrussh
# set :format, :airbrussh

# You can configure the Airbrussh format using :format_options.
# These are the defaults.
# set :format_options, command_output: true, log_file: "log/capistrano.log", color: :auto, truncate: :auto

# Default value for :pty is false
# set :pty, true

# Default value for local_user is ENV['USER']
# set :local_user, -> { `git config user.name`.chomp }

# Uncomment the following to require manually verifying the host key before first deploy.
# set :ssh_options, verify_host_key: :secure

before 'deploy:starting', :create_tmp_dir
before 'deploy:starting', :ensure_deployment_dependencies
before 'deploy:symlink:release', :build_dist
after 'deploy:symlink:release', :symlink_v3

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
  # Note that the yarn tasks below are run in sequence rather than in parallel!
  # This is necessary because in our test and prod environments we deploy simultaneously to two
  # load-balanced hosts with a shared, network-mounted user home directory, and the yarn commands
  # generally fail when running at the same time in this scenario if they're run in parallel.
  on roles(:web), in: :sequence do
    within release_path do
      execute :yarn, 'install --ignore-engines'
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
