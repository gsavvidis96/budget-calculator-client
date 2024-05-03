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
        <span class="font-weight-bold">Nuxt</span>,
        <span class="font-weight-bold">Node</span>,
        <span class="font-weight-bold">Express</span>, and
        <span class="font-weight-bold">PostgreSQL</span>. It's split into two
        repos: one for the
        <a href="https://cv.gsavvidis.com" target="_blank" class="text-primary"
          >front-end</a
        >
        and one for the
        <a href="https://cv.gsavvidis.com" target="_blank" class="text-primary"
          >back-end</a
        >.
      </div>

      <v-divider class="my-8"></v-divider>

      <div class="d-flex flex-column">
        <div class="text-h6 mb-2 font-weight-bold">Frontend details</div>

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
        <div class="text-h6 font-weight-bold mb-2">Backend details</div>

        <div class="text-body-1 mb-2">
          It is a REST API created with
          <span class="font-weight-bold">Express</span> and
          <span class="font-weight-bold">Typescript</span>, connecting to a
          <span class="font-weight-bold">PostgreSQL</span> database. API docs
          can be found
          <a
            href="https://cv.gsavvidis.com"
            target="_blank"
            class="text-primary"
            >here</a
          >. Other notable technologies used include:
        </div>

        <ul class="d-flex flex-column align-start ga-1">
          <li class="font-weight-bold">Kysely</li>
          <li class="font-weight-bold">Firebase Admin SDK</li>
          <li class="font-weight-bold">Vitest</li>
        </ul>
      </div>

      <v-divider class="my-8"></v-divider>

      <div class="d-flex flex-column">
        <div class="text-h6 font-weight-bold mb-2">Infrastructure details</div>

        <div class="text-body-1 mb-2">
          The front-end is hosted on
          <span class="font-weight-bold">Netlify</span>. The API and database
          are both hosted on a VPS, running in containers using
          <span class="font-weight-bold">Docker Compose</span>.
          <span class="font-weight-bold">GitHub Actions</span> is used for
          CI/CD.
        </div>
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
