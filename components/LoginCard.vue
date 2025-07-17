<template>
    <UModal v-model:open="forgotPasswordModal" title="Forgot Password?" close-icon="i-solar-close-circle-outline">
    <template #body>
      <div class="space-y-4 px-4 py-2">
        <p class="text-gray-300 text-sm leading-relaxed">
          You can view your password using the 24-word backup phrase given to you at the time of account creation.
          <span class="inline font-semibold italic text-indigo-400">This is the only way</span>
          to view your account password.
        </p>
                <UInput
          color="neutral"
          variant="subtle"
          placeholder="Username"
          class="w-full mt-2 bg-zinc-800/80 "
          size="lg"
          icon="i-solar-user-circle-bold"
        />
        <UInput
          color="neutral"
          variant="subtle"
          placeholder="Your recovery phrase..."
          class="w-full bg-zinc-800/80 "
          size="lg"
          icon="i-solar-key-bold"
        />
        <UButton icon="i-solar-lock-unlocked-bold" size="md" class=" bg-indigo-600 text-white text-semibold" variant="solid">View Password</UButton>
      </div>
    </template>
  </UModal>
  <UCard
    class="w-full max-w-md shadow-2xl border border-gray-700/50 backdrop-blur-sm bg-zinc-900/90"
  >
    <div class="p-8 space-y-8">
      <div class="text-center">
        <h2 class="text-3xl font-bold text-white mb-2">Welcome</h2>
        <p class="text-gray-400">Sign in to your account</p>
      </div>
      <UAlert
        v-if="hasErrors && showAlert"
        :description="errorMessage"
        color="warning"
        variant="subtle"
        icon="i-solar-shield-warning-bold"
        close
        @update:open="closeAlert()"
      />
      <form class="space-y-6" @submit.prevent="handleLogin">
        <div class="space-y-5">
          <UFormField label="Username" name="username" class="space-y-2">
            <UInput
              v-model="form.username"
              placeholder="Enter your username"
              icon="i-solar-user-circle-bold"
              :error="errors.username"
              autocomplete="username"
              size="lg"
              class="w-full"
            />
          </UFormField>
          <div />
          <UFormField label="Password" name="password" class="space-y-2">
            <UInput
              v-model="form.password"
              type="password"
              placeholder="Enter your password"
              icon="i-solar-password-minimalistic-input-bold"
              :error="errors.password"
              autocomplete="current-password"
              size="lg"
              class="w-full"
            />
            <div class="flex justify-end">
              <UButton
                variant="link"
                @click="forgotPasswordModal = true"
                size="sm"
                class="text-indigo-400 hover:cursor-pointer hover:text-indigo-300 transition-colors duration-200 p-0 h-auto"
              >
                Forgot password?
              </UButton>
            </div>
          </UFormField>
        </div>

        <UButton
          type="submit"
          block
          :loading="loading"
          size="lg"
          class="w-full bg-indigo-600 hover:bg-indigo-700 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-gray-900 text-white font-semibold py-3 px-4 rounded-lg transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] shadow-lg"
        >
          Sign in
        </UButton>

        <div class="relative">
          <div class="absolute inset-0 flex items-center">
            <div class="w-full border-t border-gray-600"></div>
          </div>
          <div class="relative flex justify-center text-sm">
            <span class="px-2 bg-zinc-900/90 text-gray-400"
              >Don't have an account?</span
            >
          </div>
        </div>

        <div class="text-center">
          <UButton
            variant="link"
            to="/register"
            size="sm"
            class="text-indigo-400 hover:text-indigo-300 transition-colors duration-200 font-medium"
          >
            Create your account →
          </UButton>
        </div>
      </form>

    </div>
  </UCard>
</template>

<script setup>

function isValidUTF8(str) {
  try {
    return str === decodeURIComponent(encodeURIComponent(str));
  } catch (e) {
    return false;
  }
}

const form = reactive({
  username: "",
  password: "",
});

const errors = reactive({
  username: "",
  password: "",
});

const loading = ref(false);
const forgotPasswordModal = ref(false);
const showAlert = ref(true);
const closeAlert = () => {
  showAlert.value = false;
  if (errors.username) {
    errors.username = "";
    form.username = "";
  }
  if (errors.password) {
    errors.password = "";
    form.password = "";
  }
};
const hasErrors = computed(() => {
  return errors.username || errors.password;
});

const errorMessage = computed(() => {
  if (errors.username) return errors.username;
  if (errors.password) return errors.password;
  return "";
});

const handleLogin = async () => {
  loading.value = true;

  // Reset alert visibility when starting a new login attempt
  showAlert.value = true;

  try {
    // Clear errors
    errors.username = "";
    errors.password = "";

    //Client side validation
    form.username = form.username.trim();
    form.password = form.password.trim();
    if (!form.username || !form.password) {
      // do nothing here, handled below
    }
    if (
      form.username.length > 24 ||
      form.password.length > 256 ||
      form.username.length < 3 ||
      form.password.length < 8
    ) {
      // do nothing here, handled below
    }

    // Validate fields
    if (!isValidUTF8(form.username)) {
      errors.username = "Invalid characters";
      loading.value = false;
    }

    if (!isValidUTF8(form.password)) {
      errors.password = "Invalid characters";
      loading.value = false;
    }

    if (!form.username.trim()) {
      errors.username = "Username must not be empty.";
    }
    if (form.username.length < 3 || form.username.length > 24) {
      errors.username = "Username: 3-24 characters required";
    }
    if (!form.password.trim()) {
      errors.password = "Password must not be empty.";
    } else if (form.password.length < 8 || form.password.length > 256) {
      errors.password = "Password: 8-256 characters required.";
    }
    if (!/(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>])/.test(form.password)) {
      errors.password = "Password: Need a number and a special character.";
    }


    console.log(errors)
    if (!errors.username && !errors.password) {
      // Proceed with login
      const sex = login(form.username, form.password);
      console.log(`Login: ${sex}`)
    } else {
      loading.value = false;
      return
    }

    // Simulate API call  
    await new Promise((resolve) => setTimeout(resolve, 1000));
  } catch (error) {
    console.error("Login error:", error);
  } finally {
    loading.value = false;
  }
};
</script>
