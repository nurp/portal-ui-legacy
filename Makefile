export JIRA_URL = https://jira.opensciencedatacloud.org/browse
export GIT_REPO = NCI-GDC/portal-ui-legacy

PATH := node_modules/.bin:$(PATH)
FDT_DIR = node_modules/hobbes

include $(FDT_DIR)/Makefile
