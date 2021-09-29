{{- define "library.pvc" -}}
{{- if .Values.pvc}}
{{- $root := . -}}
{{- range $index, $element := .Values.pvc}}
---
apiVersion: v1
kind: PersistentVolumeClaim
metadata:
  name: {{$element.name}}
  namespace: {{$root.Values.namespace}}
spec:
  accessModes:
    - ReadWriteOnce
  storageClassName: local-path
  resources:
    requests:
      storage: {{$element.storage}}
{{- end }}
{{- end }}
{{- end }}