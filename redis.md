sudo apt install redis-server

echo "deb [signed-by=/usr/share/keyrings/redis-archive-keyring.gpg] \
https://packages.redis.io/deb bullseye main" \
| sudo tee /etc/apt/sources.list.d/redis.list

sudo apt-get update
sudo apt-get install redis-stack-server

sudo systemctl enable redis-stack-server
sudo systemctl start redis-stack-server

