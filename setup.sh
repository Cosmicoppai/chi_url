#!/bin/sh

sudo apt update
sudo apt install apt-transport-https ca-certificates curl software-properties-common
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo apt-key add -
sudo add-apt-repository "deb [arch=$(dpkg --print-architecture)] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable"
sudo apt update
apt-cache policy docker-ce
sudo apt install docker-ce
sudo systemctl status docker


# Docker Compose
compose_release() {
	  curl --silent "https://api.github.com/repos/docker/compose/releases/latest" |
		    grep -Po '"tag_name": "\K.*?(?=")'
	    }

    if ! [ -x "$(command -v docker-compose)" ]; then
              sudo curl -L https://github.com/docker/compose/releases/download/$(compose_release)/docker-compose-$(uname -s)-$(uname -m) \
                        -o /usr/local/bin/docker-compose && sudo chmod +x /usr/local/bin/docker-compose
    fi


chmod -R +x ./init-letsencrypt.sh && ./init-letsencrypt.sh