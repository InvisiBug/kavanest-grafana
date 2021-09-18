{{- define "library.deployment" -}}
{{- if .Values.deployment}}
---
apiVersion: apps/v1
kind: Deployment
metadata:
  name: {{.Values.name}}
  namespace: {{.Values.namespace}}
  labels:
    app: {{.Values.name}}
spec:
  replicas: 1
  selector:
    matchLabels:
      app: {{.Values.name}}
  template:
    metadata:
      labels:
        app: {{.Values.name}}
    spec:
      containers:
      - name: {{.Values.deployment.containerName}}
        image: {{.Values.deployment.image}}
        ports:
        - containerPort: {{.Values.deployment.port}}
        {{- if .Values.deployment.resources}}
        resources:
          limits: 
            memory: {{.Values.deployment.resources.memory}}
            cpu: {{.Values.deployment.resources.cpu -}}
        {{end}}
{{- end -}}
{{- end -}}