{{- define "library.clusterIP" -}}
{{- if .Values.service}}
{{- $root := . -}}
{{- range $index, $element := .Values.service.clusterIP}}
---
apiVersion: v1
kind: Service
metadata:
  name: {{$element.name}}
  namespace: {{ $root.Values.namespace}}
spec:
  type: ClusterIP
  selector:
    app: {{$element.selector}}
  ports:
    {{- range $index2, $ports := $element.ports}}
    - name: port{{$index2}}
      port: {{$ports.port}}
      protocol: TCP
    {{- end }}
{{- end }}
{{- end }}
{{- end }}