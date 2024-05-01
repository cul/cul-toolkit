server "wcm2tstweb01.cc.columbia.edu", user: fetch(:remote_user), roles: %w{web app}
server "wcm2tstweb02.cc.columbia.edu", user: fetch(:remote_user), roles: %w{web app}
ask :branch, proc { `git tag --sort=version:refname`.split("\n").last }
set :tmp_dir, "/u/7/c/culwcm/capistrano_tmp"
