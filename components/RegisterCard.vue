<template>
  <UModal
    v-model:open="recoveryPhraseModal"
    title="Your Recovery Phrase"
    :dismissible="false"
    :close="false"
  >
    <template #body>
      <div class="space-y-4 px-4 py-2">
        <p class="text-gray-300 text-sm leading-relaxed">
          Save this 24-word backup phrase in a secure location. 
          <span class="inline font-semibold italic text-indigo-400">This is the only way</span>
          to recover your account password if you forget it.
        </p>
        <div class="bg-zinc-800/80 p-4 rounded-lg">
          <p class="text-white font-mono text-sm break-words">
            {{ generatedRecoveryPhrase }}
          </p>
        </div>
        <UButton
          @click="copyRecoveryPhrase"
          :icon="copied ? 'i-solar-check-circle-bold' : 'i-solar-copy-bold'"
          :color="copied ? 'green' : 'gray'"
          variant="soft"
          size="sm"
          class="w-full cursor-pointer"
          :class="copied ? 'border-green-500 text-green-400' : 'border-gray-600 text-gray-300 hover:text-white hover:border-gray-500'"
        >
          {{ copied ? 'Copied!' : 'Copy Recovery Phrase' }}
        </UButton>
        <div class="flex items-center space-x-3">
          <UCheckbox v-model="recoveryPhraseSaved" id="recovery-phrase-checkbox" />
          <label for="recovery-phrase-checkbox" class="text-sm text-gray-300 cursor-pointer">
            &nbsp;I have securely saved my recovery phrase
          </label>
        </div>
        <UButton 
          :disabled="!recoveryPhraseSaved"
          @click="completeRegistration"
          icon="i-solar-check-circle-bold" 
          size="md" 
          class="bg-indigo-600 text-white text-semibold w-full cursor-pointer" 
          variant="solid"
        >
          Complete Registration
        </UButton>
      </div>
    </template>
  </UModal>

  <UCard
    class="w-full max-w-md shadow-2xl border border-gray-700/50 backdrop-blur-sm bg-zinc-900/90"
  >
    <div class="p-8 space-y-8">
      <div class="text-center">
        <h2 class="text-3xl font-bold text-white mb-2">Create Account</h2>
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
      
      <form class="space-y-6" @submit.prevent="handleRegister">
        <div class="space-y-5">
          <div class="space-y-2">
            <label for="username" class="block text-sm font-medium text-gray-300">Username</label>
            <UInput
              v-model="form.username"
              id="username"
              name="username"
              placeholder="Choose your username"
              icon="i-solar-user-circle-bold"
              :error="errors.username"
              autocomplete="username"
              size="lg"
              class="w-full"
            />
          </div>
          <div/>
          <div class="space-y-2">
            <label for="email" class="block text-sm font-medium text-gray-300">Email</label>
            <UInput
              v-model="form.email"
              id="email"
              name="email"
              type="email"
              placeholder="Enter your email address"
              icon="i-solar-letter-bold"
              :error="errors.email"
              autocomplete="email"
              size="lg"
              class="w-full"
            />
          </div>
          <div/>
          <div class="space-y-2">
            <label for="password" class="block text-sm font-medium text-gray-300">Password</label>
            <UInput
              v-model="form.password"
              id="password"
              name="password"
              type="password"
              placeholder="Create a strong password"
              icon="i-solar-password-minimalistic-input-bold"
              :error="errors.password"
              autocomplete="new-password"
              size="lg"
              class="w-full"
            />
          </div>
          <div/>
          <div class="space-y-2">
            <label for="confirmPassword" class="block text-sm font-medium text-gray-300">Confirm Password</label>
            <UInput
              v-model="form.confirmPassword"
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              placeholder="Confirm your password"
              icon="i-solar-lock-password-bold"
              :error="errors.confirmPassword"
              autocomplete="new-password"
              size="lg"
              class="w-full"
            />
          </div>
        </div>

        <UButton
          type="submit"
          block
          :loading="loading"
          size="lg"
          class="w-full bg-indigo-600 hover:bg-indigo-700 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-gray-900 text-white font-semibold py-3 px-4 rounded-lg transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] shadow-lg cursor-pointer"
        >
          Create Account
        </UButton>

        <div class="relative">
          <div class="absolute inset-0 flex items-center">
            <div class="w-full border-t border-gray-600"></div>
          </div>
          <div class="relative flex justify-center text-sm">
            <span class="px-2 bg-zinc-900/90 text-gray-400"
              >Already have an account?</span
            >
          </div>
        </div>

        <div class="text-center">
          <UButton
            variant="link"
            to="/login"
            size="sm"
            class="text-indigo-400 hover:text-indigo-300 transition-colors duration-200 font-medium cursor-pointer"
          >
            Sign in instead →
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

function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

const form = reactive({
  username: "",
  email: "",
  password: "",
  confirmPassword: "",
});

// Add error handling state
const errors = reactive({
  username: "",
  email: "",
  password: "",
  confirmPassword: "",
});

const loading = ref(false);
const recoveryPhraseModal = ref(false);
const recoveryPhraseSaved = ref(false);
const generatedRecoveryPhrase = ref('');
const showAlert = ref(true);
const copied = ref(false);

// Computed properties for error display
const hasErrors = computed(() => {
  return Object.values(errors).some(error => error !== "");
});

const errorMessage = computed(() => {
  const errorList = Object.values(errors).filter(error => error !== "");
  return errorList.join(", ");
});

const closeAlert = () => {
  showAlert.value = false;
};

const completeRegistration = async () => {
  console.log("Registration already validated and successful");
  recoveryPhraseModal.value = false;
};

const copyRecoveryPhrase = async () => {
  try {
    await navigator.clipboard.writeText(generatedRecoveryPhrase.value);
    copied.value = true;
    setTimeout(() => {
      copied.value = false;
    }, 2000);
  } catch (error) {
    console.error('Failed to copy recovery phrase:', error);
  }
};

const handleRegister = async () => {
  loading.value = true;
  showAlert.value = true;

  try {
    // Clear errors
    Object.keys(errors).forEach(key => {
      errors[key] = "";
    });

    // Trim all inputs
    const trimmedForm = {
      username: form.username.trim(),
      email: form.email.trim(),
      password: form.password.trim(),
      confirmPassword: form.confirmPassword.trim()
    };

    // Update form with trimmed values
    Object.assign(form, trimmedForm);
    
    // Client-side validation for confirm password
    if (trimmedForm.password !== trimmedForm.confirmPassword) {
      errors.confirmPassword = "Passwords do not match.";
      return;
    }
    
    // Generate recovery phrase
    generatedRecoveryPhrase.value = await $fetch("/api/auth/recoveryphrase/");
    
    // Validate with server by calling the register API
    const resp = await register({
      username: trimmedForm.username,
      email: trimmedForm.email,
      password: trimmedForm.password,
      recoveryPhrase: generatedRecoveryPhrase.value,
    });
    
    if (!resp.success) {
      // Handle validation errors from server
      console.error("Registration validation failed:", resp.response);
      
      // If response contains validation errors, assign them to errors object
      if (resp.response && typeof resp.response === 'object') {
        Object.assign(errors, resp.response);
      } else {
        errors.username = "Registration failed. Please try again.";
      }
      return;
    }
    
    // If validation passed, show the recovery phrase modal
    console.log("Registration validation successful:", resp);
    recoveryPhraseModal.value = true;

  } catch (error) {
    console.error("Registration error:", error);
    
    // Handle API validation errors
    if (error.data && error.data.response && typeof error.data.response === 'object') {
      Object.assign(errors, error.data.response);
    } else {
      errors.username = "Registration failed. Please try again.";
    }
  } finally {
    loading.value = false;
  }
};
</script>