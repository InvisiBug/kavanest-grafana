{{- define "library.configmap" -}}
{{- if .Values.configmap}}
{{- $root := .}}
{{- range $index, $element := .Values.configmap }}
---
apiVersion: v1
kind: ConfigMap
metadata:
  name: {{$element.name | quote}}
  namespace: {{ $root.Values.namespace }}
data:
{{- ( $root.Files.Glob $element.file).AsConfig | nindent 2 }}
{{- end }}
{{- end }}
{{- end }}