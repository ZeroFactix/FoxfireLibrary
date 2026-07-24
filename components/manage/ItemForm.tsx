"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import Select from "@/components/ui/Select";
import { resizeImageFile } from "@/lib/image";
import type { Item, ItemStatus, LendType } from "@/lib/types";

const inputClass =
  "w-full rounded-md border border-black/15 bg-transparent px-3 py-2 text-sm outline-none focus:border-black/40 dark:border-white/20 dark:focus:border-white/40";
const labelClass = "flex flex-col gap-1 text-sm font-medium";
const photoButtonClass =
  "rounded-full border border-black/15 px-4 py-1.5 text-sm font-medium transition hover:border-black/40 dark:border-white/20 dark:hover:border-white/40";

export default function ItemForm({
  action,
  item,
  submitLabel,
}: {
  action: (formData: FormData) => void | Promise<void>;
  item?: Item;
  submitLabel: string;
}) {
  const [lendType, setLendType] = useState<LendType>(item?.lendType ?? "loan");
  const [status, setStatus] = useState<ItemStatus>(item?.status ?? "available");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | null>(null);

  useEffect(() => {
    return () => {
      if (preview) URL.revokeObjectURL(preview);
    };
  }, [preview]);

  function pickPhoto(useCamera: boolean) {
    const input = fileInputRef.current;
    if (!input) return;
    if (useCamera) {
      input.setAttribute("capture", "environment");
    } else {
      input.removeAttribute("capture");
    }
    input.click();
  }

  async function onPhotoSelected(e: React.ChangeEvent<HTMLInputElement>) {
    const original = e.target.files?.[0];
    if (!original) {
      setPreview((prev) => {
        if (prev) URL.revokeObjectURL(prev);
        return null;
      });
      return;
    }
    const resized = await resizeImageFile(original);
    if (fileInputRef.current && resized !== original) {
      const data = new DataTransfer();
      data.items.add(resized);
      fileInputRef.current.files = data.files;
    }
    setPreview((prev) => {
      if (prev) URL.revokeObjectURL(prev);
      return URL.createObjectURL(resized);
    });
  }

  return (
    <form action={action} className="flex flex-col gap-4">
      <label className={labelClass}>
        Name
        <input name="name" defaultValue={item?.name} required className={inputClass} />
      </label>

      <label className={labelClass}>
        Category
        <input
          name="category"
          defaultValue={item?.category}
          required
          placeholder="Tools, Electronics, Outdoor, Games…"
          className={inputClass}
        />
      </label>

      <label className={labelClass}>
        Description
        <textarea
          name="description"
          defaultValue={item?.description}
          required
          rows={3}
          className={inputClass}
        />
      </label>

      <div className={labelClass}>
        Condition
        <Select
          name="condition"
          ariaLabel="Condition"
          className="w-full"
          defaultValue={item?.condition ?? "good"}
          options={[
            { value: "new", label: "New" },
            { value: "good", label: "Good" },
            { value: "fair", label: "Fair" },
            { value: "worn", label: "Worn" },
          ]}
        />
      </div>

      <div className={labelClass}>
        Lend type
        <Select
          name="lendType"
          ariaLabel="Lend type"
          className="w-full"
          defaultValue={item?.lendType ?? "loan"}
          onChange={(value) => setLendType(value as LendType)}
          options={[
            { value: "loan", label: "Free loan" },
            { value: "rental", label: "Rental" },
          ]}
        />
      </div>

      {lendType === "rental" && (
        <div className="flex gap-3">
          <label className={`${labelClass} flex-1`}>
            Rate (amount)
            <input
              name="rentalRateAmount"
              type="number"
              min="0"
              defaultValue={item?.rentalRate?.amount}
              className={inputClass}
            />
          </label>
          <div className={`${labelClass} flex-1`}>
            Per
            <Select
              name="rentalRatePeriod"
              ariaLabel="Rental period"
              className="w-full"
              defaultValue={item?.rentalRate?.period ?? "day"}
              options={[
                { value: "day", label: "Day" },
                { value: "week", label: "Week" },
              ]}
            />
          </div>
        </div>
      )}

      <div className={labelClass}>
        Status
        <Select
          name="status"
          ariaLabel="Status"
          className="w-full"
          defaultValue={item?.status ?? "available"}
          onChange={(value) => setStatus(value as ItemStatus)}
          options={[
            { value: "available", label: "Available" },
            { value: "lent_out", label: "Lent out" },
            { value: "reserved", label: "Reserved" },
          ]}
        />
      </div>

      {status !== "available" && (
        <div className="flex gap-3">
          <label className={`${labelClass} flex-1`}>
            Who has it
            <input
              name="currentHolderName"
              defaultValue={item?.currentHolder?.name}
              className={inputClass}
            />
          </label>
          <label className={`${labelClass} flex-1`}>
            Due back
            <input
              name="currentHolderDueBack"
              type="date"
              defaultValue={item?.currentHolder?.dueBack}
              className={inputClass}
            />
          </label>
        </div>
      )}

      <label className={labelClass}>
        Tags (comma-separated)
        <input
          name="tags"
          defaultValue={item?.tags?.join(", ")}
          placeholder="camping, cooking"
          className={inputClass}
        />
      </label>

      <div className={labelClass}>
        Photo
        {(preview || item?.photoUrl) && (
          <div className="flex items-center gap-3">
            <div className="relative aspect-[4/3] w-28 overflow-hidden rounded-md bg-black/5 dark:bg-white/10">
              {preview ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={preview} alt="Selected preview" className="h-full w-full object-cover" />
              ) : (
                <Image
                  src={item!.photoUrl!}
                  alt={item!.name}
                  fill
                  sizes="112px"
                  className="object-cover"
                />
              )}
            </div>
            {item?.photoUrl && !preview && (
              <label className="flex items-center gap-2 text-sm font-normal">
                <input type="checkbox" name="removePhoto" />
                Remove current photo
              </label>
            )}
          </div>
        )}
        <input type="hidden" name="currentPhotoUrl" value={item?.photoUrl ?? ""} />
        <input
          ref={fileInputRef}
          type="file"
          name="photo"
          accept="image/*"
          onChange={onPhotoSelected}
          className="hidden"
        />
        <div className="flex flex-wrap gap-2">
          <button type="button" onClick={() => pickPhoto(true)} className={photoButtonClass}>
            📷 Take photo
          </button>
          <button type="button" onClick={() => pickPhoto(false)} className={photoButtonClass}>
            Choose file
          </button>
        </div>
        <span className="text-xs font-normal text-black/50 dark:text-white/50">
          {preview
            ? "New photo ready — save to apply."
            : "Optional. Take a photo on your phone, or choose a file."}
        </span>
      </div>

      <div className="flex items-center gap-3">
        <button
          type="submit"
          className="inline-flex items-center justify-center rounded-full bg-foreground px-5 py-2.5 text-sm font-medium text-background transition-colors hover:bg-[#383838] dark:hover:bg-[#ccc]"
        >
          {submitLabel}
        </button>
        <Link
          href="/manage"
          className="text-sm text-black/60 hover:text-black dark:text-white/60 dark:hover:text-white"
        >
          Cancel
        </Link>
      </div>
    </form>
  );
}
