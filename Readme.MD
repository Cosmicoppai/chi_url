# 小 URL
![GitHub contributors](https://img.shields.io/github/contributors/cosmicoppai/chi_url?color=lightgrey)
[![GitHub forks](https://img.shields.io/github/forks/cosmicoppai/chi_url?color=lightgrey)](https://github.com/Cosmicoppai/chi_url/network)
[![GitHub stars](https://img.shields.io/github/stars/cosmicoppai/chi_url?color=lightgrey)](https://github.com/Cosmicoppai/chi_url/stargazers)
[![GitHub issues](https://img.shields.io/github/issues/Cosmicoppai/chi_url?color=lightgrey)](https://github.com/Cosmicoppai/chi_url/issues)
[![MIT License](https://img.shields.io/badge/license-MIT-lightgrey)](./LICENSE)

## About
<img align="right" width="150" height="170" src="static/icon.png" alt="icon">
 An URL Shortener developed using FASTAPI, Cassandra, React and deployed using containers on cloud.

- Easy to Scale
- Highly available
- Provide stats
- ... etc
  
## Simplified Architecture
![Architecture](static/architecture.png)

## Tech Stack
> ### Backend
> * FASTAPI
> ### Front-End
> * REACT
> ### Database
> * Cassandra
> ### Load Balancer and Reverse Proxy
> * Nginx
> ### Cloud Platform
> * Linode
> ### Container Tool
> * Docker
>  ### Caching Backend
> * Redis


## SetUp and Installation

Clone the repository
```
git clone https://github.com/Cosmicoppai/chi_url
```
Create a virtual environment
```
virtualenv venv -p python3
```
Install the dependencies
```
pip install -r local/requirements.txt
```
add the key-value pairs in local/.env

```
cd local

docker-compose up
```
App should be running on [localhost](http://localhost)

## License
[MIT](http://opensource.org/licenses/MIT) © [CosmicOppai](https://github.com/cosmicoppai)
