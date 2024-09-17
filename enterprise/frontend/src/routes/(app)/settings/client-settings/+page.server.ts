import { BASE_API_URL } from "$lib/utils/constants";
import { ClientSettingsSchema } from "$lib/utils/client-settings";
import { fail, type Actions } from "@sveltejs/kit";
import { setFlash } from "sveltekit-flash-message/server";
import { setError, superValidate } from "sveltekit-superforms";
import { zod } from "sveltekit-superforms/adapters";
import type { PageServerLoad } from "./$types";
import * as m from "$paraglide/messages";

export const load: PageServerLoad = async ({ fetch }) => {
  const settings = await fetch(`${BASE_API_URL}/client-settings/`)
    .then((res) => res.json())
    .then((res) => res.results[0]);

  const model = {
    name: "clientSettings",
    localName: "clientSettings",
    localNamePlural: "clientSettings",
    verboseName: "Client settings",
    verboseNamePlural: "Client settings",
  };

  const form = await superValidate(settings, zod(ClientSettingsSchema), {
    errors: false,
  });
  return { settings, form, model };
};

export const actions: Actions = {
  editClientSettings: async (event) => {
    const formData = await event.request.formData();

    if (!formData) {
      return fail(400, { form: null });
    }

    const schema = ClientSettingsSchema;
    const form = await superValidate(formData, zod(schema));

    const endpoint = `${BASE_API_URL}/client-settings/${form.data.id}/`;

    const fileFields = Object.fromEntries(
      Object.entries(form.data).filter(([, value]) => value instanceof File),
    );

    Object.keys(fileFields).forEach((key) => {
      form.data[key] = undefined;
    });

    console.log("filefields", fileFields);

    const requestInitOptions: RequestInit = {
      method: "PATCH",
      body: JSON.stringify(form.data),
    };

    const res = await event.fetch(endpoint, requestInitOptions);

    if (!res.ok) {
      const response: Record<string, any> = await res.json();
      console.error(response);
      if (response.warning) {
        setFlash({ type: "warning", message: response.warning }, event);
        return { form };
      }
      if (response.error) {
        setFlash({ type: "error", message: response.error }, event);
        return { form };
      }
      Object.entries(response).forEach(([key, value]) => {
        setError(form, key, value);
      });
      return fail(400, { form: form });
    }

    const createdObject = await res.json();

    if (fileFields) {
      for (const [field, file] of Object.entries(fileFields)) {
        if (file.size <= 0) {
          continue;
        }
        const fileUploadEndpoint = `${BASE_API_URL}/client-settings/${createdObject.id}/${field}/upload/`;
        const fileUploadRequestInitOptions: RequestInit = {
          headers: {
            "Content-Disposition": `attachment; filename=${encodeURIComponent(file.name)}`,
          },
          method: "POST",
          body: file,
        };
        const fileUploadRes = await event.fetch(
          fileUploadEndpoint,
          fileUploadRequestInitOptions,
        );
        if (!fileUploadRes.ok) {
          const response = await fileUploadRes.json();
          console.error(response);
          if (response.non_field_errors) {
            setError(form, "non_field_errors", response.non_field_errors);
          }
          return fail(400, { form: form });
        }
      }
    }

    // const modelVerboseName: string = "clientSettings"
    //
    // setFlash(
    //   {
    //     type: "success",
    //     message: m.successfullyUpdatedObject({
    //       object:
    //         m[toCamelCase(modelVerboseName.toLowerCase())]().toLowerCase(),
    //     }),
    //   },
    //   event,
    // );
  },
};
