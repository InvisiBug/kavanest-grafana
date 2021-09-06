#!/bin/sh
 
# yarn install && \ 
# yarn build && \
# docker build -f ./Dockerfile.kube -t grafana-interconnector . && \
# docker tag grafana-interconnector 192.168.1.42:5000/grafana-interconnector && \
# docker push 192.168.1.42:5000/grafana-interconnector 

yarn install && yarn build && docker build -f ./Dockerfile.kube -t grafana-interconnector . && docker tag grafana-interconnector 192.168.1.42:5000/grafana-interconnector && docker push 192.168.1.42:5000/grafana-interconnector 
