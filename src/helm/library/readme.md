# !!!!! OUT OF DATE !!!!!


# Deployment
```yaml
deployment:
  - name: <name>
    image: <image_to_run>
    port: <external_port>
    resources: 
      memory: <size>
      cpu: <size>
    env:
      - name: <key>
        value: <value>
    volumes:
      - name: <name>
        path: <mount_path>
        selector: <pvc_selector>

  - name: grafana
    image: grafana
    port: 3000
    resources: 
      memory: "500m"
      cpu: 100m
    env:
      - name: INFLUXDB_DB
        value: sensors
      - name: INFLUXDB_ADMIN_USER
        value: admin-user
      - name: INFLUXDB_ADMIN_PASSWORD
        value: telegraf-admin-password
      - name: INFLUXDB_USER
        value: telegraf-username
      - name: INFLUXDB_PASSWORD
        value: telegraf-password
    volumes:
      - name: pv
        path: /var/lib/influxdb/
        selector: test-pvc
```
# Services
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
# Config Map
```yaml
configmap: 
  - name: <name>
    file: <path_to_file>

  - name: configmap1
    file: telegraf.conf
```

# PVC
```yaml
pvc:
  - name: <name>
    storage: <size>

  - name: test-pvc
    storage: 500mi
```
# Ingress
```yaml
ingress:
  - name: <name>
    selector: <deployment_app>
    path: <url_path>
    port: <incoming_port>
    host: <optional_host> This will enable tls

  - name: ig1
    selector: kavanet.io-service
    path: /
    port: 80
    host: grafana.kavanet.io

  - name: ig2
    selector: kavanet.io-service
    path: /test-path
    port: 26
```

