/*
 * Copyright 2015 Mozilla Foundation
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

var easel;
function createEasel() {
  var Stage = Shumway.GFX.Stage;
  var Easel = Shumway.GFX.Easel;
  var Canvas2DRenderer = Shumway.GFX.Canvas2DRenderer;

  easel = new Easel(document.getElementById("easelContainer"));
  easel.startRendering();
  return easel;
}

var easelHost;
function createEaselHost(playerWindow, recordingLimit) {
  var peer = new Shumway.Remoting.WindowTransportPeer(window, playerWindow);
  if (recordingLimit) {
    easelHost = new Shumway.GFX.Test.RecordingEaselHost(easel, peer, recordingLimit);
  } else {
    easelHost = new Shumway.GFX.Window.WindowEaselHost(easel, peer);
  }
  return easelHost;
}
