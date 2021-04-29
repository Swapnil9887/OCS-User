#!/bin/sh

CONFIG_FILE_PATH=/app/config/urls.json

check_and_set_config() {
    env_var_value=$1
    config_key=$2
    config_file_path=$3
    if [[ -n "${env_var_value}" ]]; then
        echo "Setting ${config_key} to ${env_var_value}"
        contents=$(jq '.'${config_key}' = "'${env_var_value}'"' ${config_file_path})
        echo ${contents} > ${config_file_path}
    fi
}

if [ ! "$DISABLE_OVERWRITE_APP_CONFIG_IN_ENTRYPOINT" = "true" ]
then
    check_and_set_config "${VUE_APP_OBSERVATION_PORTAL_API_URL}" "observationPortalApiUrl" "${CONFIG_FILE_PATH}"
fi

# Copy the internal observation portal url into the nginx configuration file and run the nginx entrypoint.
mkdir /init
export INTERNAL_OBSERVATION_PORTAL_API_URL=${INTERNAL_OBSERVATION_PORTAL_API_URL:-http://127.0.0.1:8000}
echo "Setting INTERNAL_OBSERVATION_PORTAL_API_URL to ${INTERNAL_OBSERVATION_PORTAL_API_URL}"
envsubst '$${INTERNAL_OBSERVATION_PORTAL_API_URL}' < /etc/nginx/app_nginx.template > /init/app_nginx.conf
exec nginx -g 'daemon off;'
