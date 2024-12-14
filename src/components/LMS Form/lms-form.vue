<template>
    <p style="font-size: 26px;font-weight: 600;color: red;text-align: center;margin-top: 10px;">...Under Development</p>
    <table class="border-collapse border-2 border-gray-500 mx-auto">
  <thead>
    <tr>
      <th class="border border-gray-400 px-4 py-2 text-gray-800">Training Name</th>
      <th class="border border-gray-400 px-4 py-2 text-gray-800">Start Date & End Date </th>
      <th class="border border-gray-400 px-4 py-2 text-gray-800">Total Hours</th>
      <th class="border border-gray-400 px-4 py-2 text-gray-800">Training Status</th>
      <th class="border border-gray-400 px-4 py-2 text-gray-800">Registration Deadline</th>
      <th class="border border-gray-400 px-4 py-2 text-gray-800">Registration Link</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td class="border border-gray-400 px-4 py-2">ReactJs</td>
      <td class="border border-gray-400 px-4 py-2">August 5th to 19th, 2024 11:00 am to 12:00 pm, IST</td>
      <td class="border border-gray-400 px-4 py-2">19 hrs</td>
      <td class="border border-gray-400 px-4 py-2">Upcoming</td>
      <td class="border border-gray-400 px-4 py-2">August 3th, 2024</td>
      <td class="border border-gray-400 px-4 py-2"><a href="">Link</a></td>
    </tr>
    <tr>
      <td class="border border-gray-400 px-4 py-2">AngularJs</td>
      <td class="border border-gray-400 px-4 py-2">December 5th to 19th, 2024 11:00 am to 12:00 pm, IST</td>
      <td class="border border-gray-400 px-4 py-2">19 hrs</td>
      <td class="border border-gray-400 px-4 py-2">Upcoming</td>
      <td class="border border-gray-400 px-4 py-2"></td>
      <td class="border border-gray-400 px-4 py-2"><a href="">Link</a></td>
    </tr>
    <tr>
      <td class="border border-gray-400 px-4 py-2">NodeJS</td>
      <td class="border border-gray-400 px-4 py-2">October 5th to 19th, 2024 11:00 am to 12:00 pm, IST</td>
      <td class="border border-gray-400 px-4 py-2">19 hrs</td>
      <td class="border border-gray-400 px-4 py-2">Upcoming</td>
      <td class="border border-gray-400 px-4 py-2">August 3th, 2024</td>
      <td class="border border-gray-400 px-4 py-2"><a href="">Link</a></td>
    </tr>
  </tbody>
</table>

 
    <!-- <form class="w-full mx-auto max-w-lg mt-6">
      <div class="flex flex-wrap -mx-3 mb-6">
        <div class="w-full md:w-1/2 px-3 mb-6 md:mb-0">
          <label
            class="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
            for="grid-first-name"
          >
            First Name
          </label>
          <input
            class="appearance-none block w-full bg-gray-200 text-gray-700 border border-red-500 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white"
            id="grid-first-name"
            type="text"
            placeholder="Jane"
          />
          <p class="text-red-500 text-xs italic">Please fill out this field.</p>
        </div>
        <div class="w-full md:w-1/2 px-3">
          <label
            class="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
            for="grid-last-name"
          >
            Last Name
          </label>
          <input
            class="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
            id="grid-last-name"
            type="text"
            placeholder="Doe"
          />
        </div>
      </div>
      <div class="flex flex-wrap -mx-3 mb-6">
        <div class="w-full px-3">
          <label
            class="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
            for="grid-password"
          >
            Password
          </label>
          <input
            class="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
            id="grid-password"
            type="password"
            placeholder="******************"
          />
          <p class="text-gray-600 text-xs italic">
            Make it as long and as crazy as you'd like
          </p>
        </div>
      </div>
      <div class="flex flex-wrap -mx-3 mb-2">
        <div class="w-full md:w-1/3 px-3 mb-6 md:mb-0">
          <label
            class="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
            for="grid-city"
          >
            City
          </label>
          <input
            class="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
            id="grid-city"
            type="text"
            placeholder="Albuquerque"
          />
        </div>
        <div class="w-full md:w-1/3 px-3 mb-6 md:mb-0">
          <label
            class="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
            for="grid-state"
          >
            State
          </label>
          <div class="relative">
            <select
              class="block appearance-none w-full bg-gray-200 border border-gray-200 text-gray-700 py-3 px-4 pr-8 rounded leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
              id="grid-state"
            >
              <option>New Mexico</option>
              <option>Missouri</option>
              <option>Texas</option>
            </select>
            <div
              class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700"
            >
              <svg
                class="fill-current h-4 w-4"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
              >
                <path
                  d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"
                />
              </svg>
            </div>
          </div>
        </div>
        <div class="w-full md:w-1/3 px-3 mb-6 md:mb-0">
          <label
            class="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
            for="grid-zip"
          >
            Zip
          </label>
          <input
            class="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
            id="grid-zip"
            type="text"
            placeholder="90210"
          />
        </div>
      </div>
    </form> -->
</template>

<script>
export default {};
</script>

<style></style>
