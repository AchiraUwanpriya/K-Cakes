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

const splitDateTime = (iso, fallbackToNow = false) => {
  const localVal = toLocalInputValue(iso, fallbackToNow);
  if (!localVal) return { date: "", time: "" };
  const [d, t] = localVal.split("T");
  return { date: d || "", time: t ? t.substring(0, 5) : "" };
};

const getValuesFromProps = (initialData = {}) => {
  const raw = initialData?.raw || {};
  const post = splitDateTime(
    raw.postDate ??
      raw.PostDate ??
      initialData?.postDate ??
      initialData?.PostDate,
    true
  );
  const expiry = splitDateTime(
    raw.expiryDate ??
      raw.ExpiryDate ??
      initialData?.expiryDate ??
      initialData?.ExpiryDate ??
      null,
    false
  );

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
    postDate_date: post.date,
    postDate_time: post.time || "12:00",
    expiryDate_date: expiry.date,
    expiryDate_time: expiry.time || "23:59",
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
    setValue,
    formState: { errors },
  } = useForm({
    defaultValues: getValuesFromProps(initialData),
  });

  useEffect(() => {
    reset(getValuesFromProps(initialData));
  }, [initialData, reset]);

  const watchExpiryDate = watch("expiryDate_date");

  const handleFormSubmit = (data) => {
    let postDateIso = "";
    if (data.postDate_date) {
      postDateIso = `${data.postDate_date}T${data.postDate_time || "00:00"}`;
    }

    let expiryDateIso = null;
    if (data.expiryDate_date) {
      expiryDateIso = `${data.expiryDate_date}T${
        data.expiryDate_time || "23:59"
      }`;
    }

    onSubmit({
      title: data.title,
      content: data.content,
      postDate: postDateIso,
      expiryDate: expiryDateIso,
      isImportant: Boolean(data.isImportant),
    });
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4 w-full">
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
          className="px-3 py-2 text-sm block w-full rounded-lg border border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-800 dark:border-gray-600 dark:text-white bg-white"
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
          className="px-3 py-2 block w-full text-sm rounded-lg border border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-800 dark:border-gray-600 dark:text-white bg-white"
        />
        {errors.content && (
          <p className="mt-1 text-sm text-red-600">{errors.content.message}</p>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Post Date */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Post Date & Time <span className="text-red-500">*</span>
          </label>
          <div className="grid grid-cols-12 gap-2">
            <div className="col-span-7">
              <input
                type="date"
                {...register("postDate_date", {
                  required: "Post date is required",
                })}
                className="px-3 py-2 text-sm block w-full rounded-lg border border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-800 dark:border-gray-600 dark:text-white bg-white"
              />
            </div>
            <div className="col-span-5">
              <input
                type="time"
                {...register("postDate_time", {
                  required: "Post time is required",
                })}
                className="px-2 py-2 text-sm block w-full rounded-lg border border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-800 dark:border-gray-600 dark:text-white bg-white"
              />
            </div>
          </div>
          {(errors.postDate_date || errors.postDate_time) && (
            <p className="mt-1 text-xs text-red-600">
              {errors.postDate_date?.message || errors.postDate_time?.message}
            </p>
          )}
        </div>

        {/* Expiry Date */}
        <div>
          <div className="flex items-center justify-between mb-1">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Expiry Date & Time{" "}
              <span className="text-xs text-gray-400 dark:text-gray-500 font-normal">
                (Optional)
              </span>
            </label>
            {watchExpiryDate && (
              <button
                type="button"
                onClick={() => {
                  setValue("expiryDate_date", "");
                  setValue("expiryDate_time", "");
                }}
                className="text-xs text-indigo-600 dark:text-indigo-400 hover:underline"
              >
                Clear
              </button>
            )}
          </div>
          <div className="grid grid-cols-12 gap-2">
            <div className="col-span-7">
              <input
                type="date"
                {...register("expiryDate_date", {
                  validate: (val) => {
                    if (!val) return true;
                    const postD = watch("postDate_date");
                    const postT = watch("postDate_time") || "00:00";
                    const expT = watch("expiryDate_time") || "23:59";
                    if (!postD) return true;
                    const postObj = new Date(`${postD}T${postT}`);
                    const expObj = new Date(`${val}T${expT}`);
                    if (!isNaN(postObj.getTime()) && !isNaN(expObj.getTime())) {
                      if (expObj <= postObj) {
                        return "Expiry must be after post date";
                      }
                    }
                    return true;
                  },
                })}
                className={`px-3 py-2 text-sm block w-full rounded-lg border shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-800 dark:border-gray-600 dark:text-white bg-white ${
                  errors.expiryDate_date
                    ? "border-red-400 focus:border-red-500 focus:ring-red-500"
                    : "border-gray-300"
                }`}
              />
            </div>
            <div className="col-span-5">
              <input
                type="time"
                {...register("expiryDate_time")}
                className="px-2 py-2 text-sm block w-full rounded-lg border border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-800 dark:border-gray-600 dark:text-white bg-white"
              />
            </div>
          </div>
          {errors.expiryDate_date && (
            <p className="mt-1 text-xs text-red-600">
              {errors.expiryDate_date.message}
            </p>
          )}
        </div>
      </div>

      <div className="flex items-center gap-2 pt-1">
        <input
          id="isImportant"
          type="checkbox"
          {...register("isImportant")}
          className="h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500 cursor-pointer"
        />
        <label
          htmlFor="isImportant"
          className="text-sm text-gray-700 dark:text-gray-300 cursor-pointer select-none"
        >
          Mark as important
        </label>
      </div>

      <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-2 pt-2">
        {onCancel && (
          <Button
            type="button"
            variant="secondary"
            onClick={onCancel}
            disabled={loading}
            className="w-full sm:w-auto"
          >
            Cancel
          </Button>
        )}
        <Button
          type="submit"
          variant="primary"
          disabled={loading}
          className="w-full sm:w-auto"
        >
          {loading
            ? "Saving..."
            : isEditing
            ? "Update Notice"
            : "Save Announcement"}
        </Button>
      </div>
    </form>
  );
};

export default AnnouncementForm;
