{{- define "library.loadBalancer" -}}
{{- if .Values.service}}
{{- $root := . -}}
{{- range $index, $element := .Values.service.loadBalancer }}
---
apiVersion: v1
kind: Service
metadata:
  name: {{$element.name}}
  namespace: {{ $root.Values.namespace }}
spec:
  type: LoadBalancer
  selector:
    app: {{$element.selector}}
  ports:
    - name: {{$element.name}}
      port: {{$element.port}}
      targetPort: {{$element.containerPort}}
      protocol: TCP
{{- end -}}
{{- end -}}
{{- end -}}