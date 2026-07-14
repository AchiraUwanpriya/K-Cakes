import { useForm } from "react-hook-form";
import Button from "../common/Button";

const toLocalInputValue = (iso) => {
  try {
    if (!iso) {
      const now = new Date();
      const pad = (n) => String(n).padStart(2, "0");
      return `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(
        now.getDate()
      )}T${pad(now.getHours())}:${pad(now.getMinutes())}`;
    }
    const d = new Date(iso);
    if (Number.isNaN(d.getTime())) return "";
    const pad = (n) => String(n).padStart(2, "0");
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(
      d.getDate()
    )}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
  } catch (e) {
    return "";
  }
};

const AnnouncementForm = ({ onSubmit, loading, initialData = {} }) => {
  const defaultValues = {
    title: initialData.Title || initialData.title || "",
    content: initialData.Content || initialData.content || "",
    postDate: toLocalInputValue(initialData.PostDate || initialData.postDate),
    expiryDate: toLocalInputValue(
      initialData.ExpiryDate || initialData.expiryDate || null
    ),
    isImportant:
      initialData.IsImportant !== undefined
        ? Boolean(initialData.IsImportant)
        : Boolean(initialData.isImportant),
  };

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues,
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 w-full">
      <div>
        <label
          htmlFor="title"
          className="block text-sm font-medium text-gray-700 dark:text-gray-300"
        >
          Title
        </label>
        <input
          id="title"
          name="title"
          type="text"
          {...register("title", { required: "Title is required" })}
          className="mt-1 px-2 py-2 text-sm block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
        />
        {errors.title && (
          <p className="mt-1 text-sm text-red-600">{errors.title.message}</p>
        )}
      </div>

      <div>
        <label
          htmlFor="content"
          className="block text-sm font-medium text-gray-700 dark:text-gray-300"
        >
          Content
        </label>
        <textarea
          id="content"
          name="content"
          rows={4}
          {...register("content", { required: "Content is required" })}
          className="mt-1 px-2 py-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
        />
        {errors.content && (
          <p className="mt-1 text-sm text-red-600">{errors.content.message}</p>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Post Date
          </label>
          <input
            type="datetime-local"
            {...register("postDate")}
            className="mt-1 px-2 py-2 text-sm block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Expiry Date
          </label>
          <input
            type="datetime-local"
            {...register("expiryDate")}
            className="mt-1 px-2 py-2 text-sm block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          />
        </div>
      </div>

      <div className="flex items-center gap-2">
        <input
          id="isImportant"
          type="checkbox"
          {...register("isImportant")}
          className="h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
        />
        <label htmlFor="isImportant" className="text-sm text-gray-700 dark:text-gray-300">
          Mark as important
        </label>
      </div>

      <div className="flex justify-end">
        <Button type="submit" variant="primary" disabled={loading}>
          {loading ? "Saving..." : "Save Announcement"}
        </Button>
      </div>
    </form>
  );
};

export default AnnouncementForm;
