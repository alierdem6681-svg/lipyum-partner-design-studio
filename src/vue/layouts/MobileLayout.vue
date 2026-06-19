<script setup>
import { svgSpriteMarkup } from "../icons/svgSprite.js";
</script>

<template>
  <div class="v-app studio">
    <div v-html="svgSpriteMarkup"></div>
    <main class="phone-stage" aria-label="Mobil uygulama prototipi">
      <div class="phone">
        <div class="phone-screen">
          <div class="dynamic-island-demo camera-only" aria-hidden="true"></div>
          <div class="status-bar" aria-hidden="true">
            <span>09:41</span>
            <div class="status-icons">
              <div class="signal"><span></span><span></span><span></span><span></span></div>
              <span style="font-size: 11px">5G</span>
              <div class="battery"><span></span></div>
            </div>
          </div>
          <div class="app v-mobile-app">
            <slot />
          </div>
        </div>
      </div>
    </main>
  </div>
</template>
