<template>
  <div>
    <div class="demo-wrapper">
      <p>
        The progress bar can be also displayed in its radial variant by setting
        to true the
        <span class="code-word">isRadial</span> prop. <br />When this variant is
        enabled, some styling props won't have any effect (check the playground
        for more info about which ones can be used).
      </p>
      <br />
      <div class="demo-container">
        <div class="kup-container" style="width: 100%; margin: 2rem 0;">
          <kup-progress-bar
            icon="widgets"
            is-radial
            value="0.1"
            style="width: 25%; margin: auto;"
          ></kup-progress-bar>
          <kup-progress-bar
            is-radial
            value="99.9"
            style="width: 25%; margin: auto;"
          ></kup-progress-bar>
        </div>
        <p class="centered">Sample radial markup</p>
        <code class="flat">{{ markupRadial }}</code>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ProgressbarRadial',
  data() {
    return {
      markupRadial:
        '<kup-progress-bar is-radial value="your_value"></kup-progress-bar>',
    };
  },
};
</script>
