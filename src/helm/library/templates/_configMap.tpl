{{- define "library.configMap" -}}
{{- if .Values.configMap}}
---
apiVersion: v1
kind: ConfigMap
metadata:
  name: {{.Values.config.name}}
data:
{{ (.Files.Glob .Values.config.file).AsConfig | indent 2 }}
{{- end -}}
{{- end -}}