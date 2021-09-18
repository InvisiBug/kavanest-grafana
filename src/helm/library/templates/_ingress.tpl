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
    cert-manager.io/cluster-issuer: "letsencrypt-prod"
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
              number: 80
  tls:
  - hosts:
    - {{$element.host}}
    secretName: {{$element.host}}-tls
{{- end -}}
{{- end -}}
{{- end -}}