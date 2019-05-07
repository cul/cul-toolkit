lock "3.9.1"

set :department, 'cul'
set :application, 'toolkit'
set :remote_user, "culwcm"
set :repo_url, "git@github.com:cul/#{fetch(:department)}-#{fetch(:application)}.git"
set :deploy_to, "/wcm-local/cul-toolkit/deployments/v3"
set :ssh_options, { :forward_agent => true }
set :keep_releases, 2

set :v3_docroot, '/wcm-local/cul-toolkit/html/v3'

before 'deploy:starting', :create_tmp_dir
before 'deploy:starting', :confirm_build
after 'deploy:finished', :symlink_v3

desc 'create tmp directory'
task :create_tmp_dir do
  on roles(:web) do
    execute :mkdir, '-p', fetch(:tmp_dir)
  end
end

desc 'confirm that the build task has been run'
task :confirm_build do
  ask(:ok, "ok")
  puts "Don't forget to build the latest version of the code base before deploying!"
  puts fetch(:ok)
end

desc 'symlink v3'
task :symlink_v3 do
  on roles(:web) do
    execute :ln, '-sf', File.join(fetch(:deploy_to), 'current', 'dist'), fetch(:v3_docroot)
  end
end

task :build do
  exec 'yarn build'
end
