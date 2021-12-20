#!/bin/sh

clear && cd helm && \
helm upgrade grafana . \
--install \
--namespace grafana \
--create-namespace
