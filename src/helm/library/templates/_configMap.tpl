{{- define "library.configmap" -}}
{{- if .Values.configmap}}
---
apiVersion: v1
kind: ConfigMap
metadata:
  name: {{.Values.configmap.file | quote}}
data:
  {{ (.Fles.Glob .Values.configmap.file ).AsConfig | indent 2 }}
{{- end }}
{{- end }}