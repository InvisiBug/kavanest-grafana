{{- define "library.configmap" -}}
{{- if .Values.configmap}}
{{- $root := . -}}
{{- range $index, $element := .Values.configmap }}
---
apiVersion: v1
kind: ConfigMap
metadata:
  name: {{$element.name}}
data:
{{ (.Files.Glob $element.file ).AsConfig | indent 2 }}
{{- end }}
{{- end }}
{{- end }}