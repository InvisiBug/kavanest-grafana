{{- define "library.nodePort" -}}
{{- if .Values.service}}
{{- $root := . -}}
{{- range $index, $element := .Values.service.nodePort}}
---
apiVersion: v1
kind: Service
metadata:
  name: {{$element.name}}
  namespace: {{ $root.Values.namespace }}
spec:
  type: NodePort
  selector:
    app: {{$element.selector}}
  ports:
    - name: {{$element.name}}
      port: {{$element.port}}
      nodePort: {{$element.nodePort}}
      protocol: TCP
{{- end -}}
{{- end -}}
{{- end -}}