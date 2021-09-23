{{- define "library.configmap" -}}
{{- if .Values.configmap}}
{{- $root := . -}}
{{- range $index, $element := .Values.configmap }}
---
apiVersion: v1
kind: ConfigMap
metadata:
  name: {{$element.file | quote}}
data:
  test.conf |
  sometest
{{- end }}
{{- end }}
{{- end }}