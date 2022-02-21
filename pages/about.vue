<template>
  <v-row justify="center" align="center">
    <v-col cols="auto">
      <v-card>
        <v-card-title class="headline">
          Welcome to Ngirit PWA
        </v-card-title>
        <v-card-text>
          <p>Ngirit is a family app, designed to be calculator for all family member to note expenses</p>
          <p>Because every penny is matter, note it!.</p>
          <hr>
          <br>
          <h4>Based on: ngirit.yudhawijaya.com || @gajayana </h4>
          <br>
          <div class="text-xs-right">
            <em><small>&mdash; Rino D. C.</small></em>
          </div>
          <hr class="my-3">
          <br>
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn
            color="primary"
            nuxt
            to="/"
          >
            Continue
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-col>
  </v-row>
</template>

<script>
export default {
  name: 'AboutPage'
}
</script>
