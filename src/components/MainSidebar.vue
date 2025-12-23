<template>
  <v-navigation-drawer v-model="navigationDrawer" temporary location="right" touchless>
    <div class="d-flex flex-column h-100">
      <div class="d-flex flex-column">
        <div class="list-item d-flex align-center ga-4 rounded pa-4" @click="toggleDark()">
          <v-icon class="text-medium-emphasis">{{
            isDark ? 'mdi-white-balance-sunny' : 'mdi-weather-night'
          }}</v-icon>

          <div class="text-body-1 list-item-text">{{ isDark ? 'Light' : 'Dark' }} mode</div>
        </div>

        <div
          class="list-item d-flex align-center ga-4 rounded pa-4"
          @click="logoutConfirmation = true"
          v-if="user"
        >
          <v-icon class="text-medium-emphasis" icon="mdi-logout" />

          <div class="text-body-1 list-item-text">Logout</div>
        </div>
      </div>
    </div>
  </v-navigation-drawer>

  <ConfirmationDialog
    v-model="logoutConfirmation"
    title="Are you sure you want to log out?"
    @cancel="logoutConfirmation = false"
    @confirm="logout"
  />
</template>

<script setup lang="ts">
const isDark = useDark()
const toggleDark = useToggle(isDark)

const { navigationDrawer } = storeToRefs(useBaseStore())
const { user } = storeToRefs(useUserStore())

const logoutConfirmation = ref(false)

const logout = () => {
  supabase.auth.signOut()
  logoutConfirmation.value = false
}
</script>

<style scoped>
.list-item {
  text-decoration: none;
  color: inherit;
  cursor: pointer;
  white-space: nowrap;

  &:hover {
    background-color: rgba(var(--v-theme-on-background), 0.06);
  }

  &.router-link-active {
    background-color: rgba(var(--v-theme-on-background), 0.12);

    & .list-item-text {
      font-weight: 900;
    }
  }
}
</style>
