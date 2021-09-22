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
      {{- if $element.volumes}}
      volumes:
      {{- range $index2, $vols := $element.volumes}}
      - name: {{$vols.name}}
        persistentVolumeClaim:
          claimName: {{$vols.pvcName }}
      {{- end }}
      {{ end -}}

      containers:
      - name: {{$element.name}}
        image: {{$element.image}}
        ports:
        - containerPort: {{$element.port}}

        {{- if $element.resources}}
        resources:
          limits: 
            memory: {{$element.resources.memory}}
            cpu: {{$element.resources.cpu }}
        {{- end}}

        {{- if $element.volumes}}
        volumeMounts:
        {{- range $index2, $vols := $element.volumes}}
        - name: {{$vols.name}}
          mountPath: {{$vols.path }}
        {{- end }}
        {{- end }}

        {{- if $element.env}}
        env:
        {{- range $index2, $vars := $element.env}}
          - name: {{ $vars.name }}
            value: {{ $vars.value }}
        {{- end -}}
        {{- end -}}

{{- end -}}
{{- end -}}
{{- end -}}