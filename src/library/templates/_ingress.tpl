{{- define "library.ingress" -}}
{{- if .Values.ingress}}
{{- $root := . -}}
{{- range $index, $element := .Values.ingress }}
---
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: {{$element.name}}
  namespace: {{ $root.Values.namespace }}
  annotations:
    kubernetes.io/ingress.class: "nginx"
    nginx.ingress.kubernetes.io/rewrite-target: /
    nginx.ingress.kubernetes.io/proxy-body-size: 1G
    {{- if $element.host}}
    cert-manager.io/cluster-issuer: "letsencrypt-prod"
    {{- end -}}
{{- if $element.host}}
spec:
  rules:
  - host: {{$element.host}}
    http:
      paths:
      - path: /
        pathType: Prefix
        backend:
          service:
            name: {{$element.selector}}
            port: 
              number: {{$element.port}}
  {{- if $element.host}}
  tls:
  - hosts:
    - {{$element.host}}
    secretName: {{$element.host}}-tls
  {{- end -}}
{{ else }}
spec:
  rules:
  - http:
      paths:
      - path: /
        pathType: Prefix
        backend:
          service:
            name: {{$element.selector}}
            port: 
              number: {{$element.port}}
{{- end -}}
{{- end -}}
{{- end -}}
{{- end -}}