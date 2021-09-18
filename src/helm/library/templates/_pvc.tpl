---
apiVersion: v1
kind: PersistentVolumeClaim
metadata:
  name: influx
  namespace: grafana
spec:
  accessModes:
    - ReadWriteOnce
  storageClassName: local-path
  resources:
    requests:
      storage: 500Mi