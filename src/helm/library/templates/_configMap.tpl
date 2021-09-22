{{- define "library.configmap" -}}
{{- if .Values.configmap}}
{{- $root := . -}}
{{- range $index, $element := .Values.configMap }}
---
apiVersion: v1
kind: ConfigMap
metadata:
  name: {{.Values.configmap.name}}
data:
{{ (.Files.Glob .Values.config.file).AsConfig | indent 2 }}
{{- end }}
{{- end }}
{{- end }}