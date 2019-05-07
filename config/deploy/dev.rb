server "wcm-dev-web1.cul.columbia.edu", user: fetch(:remote_user), roles: %w{web app}
ask :branch, `git rev-parse --abbrev-ref HEAD`.chomp
set :tmp_dir, "/home/culwcm/capistrano_tmp"
