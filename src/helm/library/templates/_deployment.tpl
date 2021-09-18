{{- define "library.deployment" -}}
{{- if .Values.deployment}}
{{- $root := . -}}
{{- range $index, $element := .Values.deployment}}
---
apiVersion: apps/v1
kind: Deployment
metadata:
  name: {{$element.name}}
  namespace: {{ $root.Values.namespace }}
  labels:
    app: {{$element.name}}
spec:
  replicas: 1
  selector:
    matchLabels:
      app: {{$element.name}}
  template:
    metadata:
      labels:
        app: {{$element.name}}
    spec:
      containers:
      - name: {{$element.name}}
        image: {{$element.image}}
        ports:
        - containerPort: {{$element.port}}
        {{- if $element.resources}}
        resources:
          limits: 
            memory: {{$element.resources.memory}}
            cpu: {{$element.resources.cpu -}}
        {{end}}
{{- end -}}
{{- end -}}
{{- end -}}