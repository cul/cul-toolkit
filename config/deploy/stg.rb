server "wcm2stgweb01.cc.columbia.edu", user: fetch(:remote_user), roles: %w{web app}
server "wcm2stgweb02.cc.columbia.edu", user: fetch(:remote_user), roles: %w{web app}
ask :branch, `git rev-parse --abbrev-ref HEAD`.chomp
set :tmp_dir, "/u/7/c/culwcm/capistrano_tmp"
