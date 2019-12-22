#!/usr/local/bin/python3.6
# -*- coding: utf-8 -*-

import http.client


# run "node HTTPServer.js" to start the HTTP Server
# then we write our own client

if __name__ == '__main__':
    c1 = http.client.HTTPConnection('localhost', 8888)
    c1.request('GET', '')
    res = c1.getresponse()

    print(res.status, res.reason, res.getheaders(), res.msg, res.read())
