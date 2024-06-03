<template>
  <div class="page-wrapper">
    <div class="inner-wrapper d-flex flex-column flex-grow-1">
      <div class="text-h4 text-center align-self-center mb-8">
        About the project
      </div>

      <div class="text-body-1">
        This project was created by
        <a href="https://cv.gsavvidis.com" target="_blank" class="text-primary"
          >Giannis Savvidis</a
        >
        for fun and showcasing purposes. The main technologies used include
        <span class="font-weight-bold">Typescript</span>,
        <span class="font-weight-bold">Nuxt.js</span>,
        <span class="font-weight-bold">Node.js</span>,
        <span class="font-weight-bold">Neon Serverless Postgres</span>, and
        <span class="font-weight-bold">Serverless Framework</span>. It's split
        into two repos: one for the
        <a
          href="https://github.com/gsavvidis96/budget-calculator-client"
          target="_blank"
          class="text-primary"
          >Client</a
        >
        and one for the
        <a
          href="https://github.com/gsavvidis96/budget-calculator-api"
          target="_blank"
          class="text-primary"
          >API</a
        >.
      </div>

      <v-divider class="my-8"></v-divider>

      <div class="d-flex flex-column">
        <div class="text-h6 mb-2 font-weight-bold">Client details</div>

        <div class="text-body-1 mb-2">
          It is build with
          <span class="font-weight-bold">Nuxt</span>
          and
          <span class="font-weight-bold">Typescript</span>. Other notable
          technologies used include:
        </div>

        <ul class="d-flex flex-column align-start ga-1">
          <li class="font-weight-bold">Vuetify</li>
          <li class="font-weight-bold">Firebase Authentication</li>
          <li class="font-weight-bold">Pinia</li>
        </ul>
      </div>

      <v-divider class="my-8"></v-divider>

      <div class="d-flex flex-column">
        <div class="text-h6 font-weight-bold mb-2">API details</div>

        <div class="text-body-1 mb-2">
          It is a REST API created with
          <span class="font-weight-bold">AWS API Gateway</span>,
          <span class="font-weight-bold">AWS Lambda</span> and
          <span class="font-weight-bold">Typescript</span>, deployed using the
          <span class="font-weight-bold">Serverless Framework</span>. It is
          connecting to a
          <span class="font-weight-bold">Neon Serverless Postgres</span>
          database. API docs can be found
          <a
            href="https://budget-api.gsavvidis.com/docs"
            target="_blank"
            class="text-primary"
            >here</a
          >. Other notable technologies used include:
        </div>

        <ul class="d-flex flex-column align-start ga-1">
          <li class="font-weight-bold">Kysely Query Builder</li>
          <li class="font-weight-bold">Firebase Admin SDK</li>
          <li class="font-weight-bold">Vitest</li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts"></script>

<style scoped lang="scss">
a {
  text-decoration: none;

  &:hover {
    text-decoration: underline;
  }
}

ul {
  padding: revert;
}
</style>
