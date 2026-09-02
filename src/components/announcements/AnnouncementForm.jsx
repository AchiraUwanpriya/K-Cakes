import { useEffect } from "react";
import { useForm } from "react-hook-form";
import Button from "../common/Button";

const toLocalInputValue = (iso, fallbackToNow = false) => {
  try {
    if (!iso) {
      if (!fallbackToNow) return "";
      const now = new Date();
      const pad = (n) => String(n).padStart(2, "0");
      return `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(
        now.getDate()
      )}T${pad(now.getHours())}:${pad(now.getMinutes())}`;
    }

    if (typeof iso === "string") {
      const trimmed = iso.trim();
      // If it's a local ISO string WITHOUT timezone offset (e.g. "2026-09-01T09:10:00" or "2026-09-01T09:10")
      if (/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}(:\d{2}(\.\d+)?)?$/.test(trimmed)) {
        return trimmed.substring(0, 16);
      }
      // If it ends with Z or has a timezone offset, convert to local datetime
      const d = new Date(trimmed);
      if (!Number.isNaN(d.getTime())) {
        const pad = (n) => String(n).padStart(2, "0");
        return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(
          d.getDate()
        )}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
      }
      return trimmed.substring(0, 16);
    }

    if (iso instanceof Date && !Number.isNaN(iso.getTime())) {
      const pad = (n) => String(n).padStart(2, "0");
      return `${iso.getFullYear()}-${pad(iso.getMonth() + 1)}-${pad(
        iso.getDate()
      )}T${pad(iso.getHours())}:${pad(iso.getMinutes())}`;
    }

    return "";
  } catch (e) {
    return "";
  }
};

const getValuesFromProps = (initialData = {}) => {
  const raw = initialData?.raw || {};
  return {
    title:
      initialData?.Title ??
      initialData?.title ??
      raw.Title ??
      raw.title ??
      "",
    content:
      initialData?.Content ??
      initialData?.content ??
      raw.Content ??
      raw.content ??
      "",
    postDate: toLocalInputValue(
      raw.postDate ??
      raw.PostDate ??
      initialData?.postDate ??
      initialData?.PostDate,
      true
    ),
    expiryDate: toLocalInputValue(
      raw.expiryDate ??
      raw.ExpiryDate ??
      initialData?.expiryDate ??
      initialData?.ExpiryDate ??
      null,
      false
    ),
    isImportant:
      initialData?.IsImportant !== undefined
        ? Boolean(initialData.IsImportant)
        : initialData?.isImportant !== undefined
        ? Boolean(initialData.isImportant)
        : Boolean(raw.isImportant ?? raw.IsImportant),
  };
};

const AnnouncementForm = ({
  onSubmit,
  loading,
  initialData = {},
  isEditing = false,
  onCancel,
}) => {
  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: getValuesFromProps(initialData),
  });

  useEffect(() => {
    reset(getValuesFromProps(initialData));
  }, [initialData, reset]);

  const postDateValue = watch("postDate");

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 w-full">
      <div>
        <label
          htmlFor="title"
          className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
        >
          Title <span className="text-red-500">*</span>
        </label>
        <input
          id="title"
          name="title"
          type="text"
          placeholder="e.g. No Classes Tomorrow"
          {...register("title", { required: "Title is required" })}
          className="px-3 py-2 text-sm block w-full rounded-md border border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-800 dark:border-gray-600 dark:text-white bg-white"
        />
        {errors.title && (
          <p className="mt-1 text-sm text-red-600">{errors.title.message}</p>
        )}
      </div>

      <div>
        <label
          htmlFor="content"
          className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
        >
          Content <span className="text-red-500">*</span>
        </label>
        <textarea
          id="content"
          name="content"
          rows={4}
          placeholder="Enter notice description..."
          {...register("content", { required: "Content is required" })}
          className="px-3 py-2 block w-full text-sm rounded-md border border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-800 dark:border-gray-600 dark:text-white bg-white"
        />
        {errors.content && (
          <p className="mt-1 text-sm text-red-600">{errors.content.message}</p>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Post Date
          </label>
          <input
            type="datetime-local"
            {...register("postDate")}
            className="px-3 py-2 text-sm block w-full rounded-md border border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-800 dark:border-gray-600 dark:text-white bg-white"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Expiry Date
          </label>
          <input
            type="datetime-local"
            {...register("expiryDate", {
              validate: (expiryVal) => {
                if (!expiryVal) return true; // optional field — no expiry is fine
                if (!postDateValue) return true; // no post date to compare against
                const expiry = new Date(expiryVal);
                const post = new Date(postDateValue);
                if (isNaN(expiry.getTime()) || isNaN(post.getTime())) return true;
                if (expiry <= post) {
                  return "Expiry date must be after the post date.";
                }
                return true;
              },
            })}
            className={`px-3 py-2 text-sm block w-full rounded-md border shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-800 dark:border-gray-600 dark:text-white bg-white ${
              errors.expiryDate
                ? "border-red-400 focus:border-red-500 focus:ring-red-500"
                : "border-gray-300"
            }`}
          />
          {errors.expiryDate && (
            <p className="mt-1 text-sm text-red-600">{errors.expiryDate.message}</p>
          )}
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

      <div className="flex justify-end gap-2">
        {onCancel && (
          <Button
            type="button"
            variant="secondary"
            onClick={onCancel}
            disabled={loading}
          >
            Cancel
          </Button>
        )}
        <Button type="submit" variant="primary" disabled={loading}>
          {loading ? "Saving..." : isEditing ? "Update Notice" : "Save Announcement"}
        </Button>
      </div>
    </form>
  );
};

export default AnnouncementForm;
