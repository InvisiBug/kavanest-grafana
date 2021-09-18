{{- define "library.clusterIP" -}}
{{- if .Values.service}}
{{- $root := . -}}
{{- range $index, $element := .Values.service.clusterIP}}
---
apiVersion: v1
kind: Service
metadata:
  name: {{$element.name}}
  namespace: {{ $root.Values.namespace}}
spec:
  type: ClusterIP
  selector:
    app: {{$element.selector}}
  ports:
    - name: {{$element.name}}
      port: {{$element.port}}
      protocol: TCP
{{- end -}}
{{- end -}}
{{- end -}}
