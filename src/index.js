/*
Copyright 2018 Michiel Hendriks

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
*/
(function (doc) {
  function getScriptBase () {
    var scripts = document.querySelectorAll('script[src]')
    var path = scripts[ scripts.length - 1 ].src.split('/')
    path.pop()
    return path.join('/') + '/'
  }

  var viewerUrl = window.SHUMWAY_VIEWER_URL || getScriptBase() + 'shumway-dist/iframe/viewer.html'
  var baseUrl = document.location.protocol + '//' + document.location.host + document.location.pathname

  // can the movie be loaded via a postMessage(...)
  var canPostMessage = typeof window.postMessage === 'function'

  function replaceWithShumway (elm, flash) {
    var viewer = doc.createElement('iframe')
    viewer.frameBorder = 0
    viewer.src = viewerUrl
    viewer.height = flash.height
    viewer.width = flash.width
    viewer.className = 'shumway'

    if (canPostMessage) {
      flash.baseUrl = baseUrl
      viewer.onload = function () {
        var msg = {
          type: 'pluginParams',
          flashParams: flash
        }
        viewer.contentWindow.postMessage(msg, '*')
      }
    } else {
      viewer.src = viewerUrl + '?swf=' + flash.url + '&base=' + baseUrl
    }

    elm.parentNode.replaceChild(viewer, elm)
  }

  /*
   Source: shumway/iframe/viewer.js
   Apache 2.0 License
  */
  function parseQueryString (qs) {
    if (!qs) {
      return {}
    }

    if (qs.charAt(0) === '?') {
      qs = qs.slice(1)
    }

    var values = qs.split('&')
    var obj = {}
    for (var i = 0; i < values.length; i++) {
      var kv = values[i].split('=')
      var key = kv[0]; var value = kv[1]
      obj[decodeURIComponent(key)] = decodeURIComponent(value)
    }

    return obj
  }

  function isFlashMime (mime) {
    mime = (mime || '').toLowerCase()
    return (mime === 'application/x-shockwave-flash' || mime === 'application/vnd.adobe.flash-movie')
  }

  function replaceActiveX (elm) {
    var classid = (elm.getAttribute('classid') || '').toLowerCase()
    if (classid !== 'clsid:d27cdb6e-ae6d-11cf-96b8-444553540000' && !isFlashMime(elm.getAttribute('type'))) {
      return
    }
    var flash = {
      height: elm.height,
      width: elm.width,
      objectParams: {}
    }
    var params = elm.getElementsByTagName('param')
    for (var i = 0; i < params.length; ++i) {
      var param = params[i]
      if (param.name.toLowerCase() === 'movie') {
        flash.url = param.value
      } else if (param.name.toLowerCase() === 'flashvars') {
        flash.movieParams = parseQueryString(param.value)
      } else {
        flash.objectParams[param.name] = param.value
      }
    }
    replaceWithShumway(elm, flash)
  }

  function replaceEmbed (elm) {
    if (!isFlashMime(elm.getAttribute('type'))) {
      return
    }
    var flash = {
      url: elm.src,
      height: elm.height,
      width: elm.width,
      objectParams: {},
      movieParams: parseQueryString(elm.getAttribute('flashvars'))
    }
    for (var i = 0; i < elm.attributes.length; ++i) {
      var attr = elm.attributes[i].name
      if (attr === 'src' || attr === 'height' || attr === 'width' || attr === 'flashvars' || attr === 'type' || attr === 'pluginspage') {
        // ignore
      } else {
        flash.objectParams[attr] = elm.attributes[i].value
      }
    }
    replaceWithShumway(elm, flash)
  }

  function replaceFlash () {
    var elements = doc.getElementsByTagName('object')
    for (var i = 0; i < elements.length; ++i) {
      replaceActiveX(elements[i])
    }
    elements = doc.getElementsByTagName('embed')
    for (i = 0; i < elements.length; ++i) {
      replaceEmbed(elements[i])
    }
  }

  doc.addEventListener('DOMContentLoaded', replaceFlash)
}(document))
