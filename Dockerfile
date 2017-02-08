FROM bitnami/minideb
MAINTAINER Joseda <josriolop@gmail.com>

WORKDIR /tmp

# Install Watchman
ENV WATCHMAN_VERSION 4.7.0
RUN install_packages curl ca-certificates gcc make autoconf python-dev libpython-dev autotools-dev automake && \
    curl -LO https://github.com/facebook/watchman/archive/v${WATCHMAN_VERSION}.tar.gz && \
    tar xzf v${WATCHMAN_VERSION}.tar.gz && rm v${WATCHMAN_VERSION}.tar.gz && \
    cd watchman-${WATCHMAN_VERSION} && ./autogen.sh && ./configure && make && make install && \
     apt-get purge -y curl ca-certificates gcc make autoconf python-dev libpython-dev autotools-dev automake && \
    cd /tmp && rm -rf watchman-${WATCHMAN_VERSION}
