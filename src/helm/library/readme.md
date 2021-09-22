
# Nodeport
```yaml
service:  
  nodePort:
    - name: <name>
      selector: <deployment_name>
      port: <deployment_port>
      nodePort: <external_port>

    - name: np21
      selector: nginx1
      port: 80
      nodePort: 31001

  clusterIP:
    - name: <name>
      selector: <deployment>
      port: <internal_port>

    - name: cip1
      selector: nginx2
      port: 80

  loadBalancer:
    - name: <name>
      selector: <deployment_name>
      port: <external_port>

    - name: lb1
      selector: nginx3
      port: 80
```