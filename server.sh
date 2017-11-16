# Use this script to run localhost server

script_dir=$(cd $(dirname ${BASH_SOURCE:-$0}); pwd)
cd $script_dir
python3 -m http.server 8000
