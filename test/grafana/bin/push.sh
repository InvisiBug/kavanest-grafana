#!/bin/sh
 
docker build -t grafana-interconnector . && docker tag grafana-interconnector 192.168.1.42:5000/grafana-interconnector && docker push 192.168.1.42:5000/grafana-interconnector 