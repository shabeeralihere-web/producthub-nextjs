"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  FiCamera,
  FiCheck,
  FiImage,
  FiLoader,
  FiMail,
  FiShield,
  FiUser,
  FiX,
} from "react-icons/fi";

import { useAuth } from "@/context/AuthContext";

import styles from "./ProfileEditForm.module.css";

export default function ProfileEditForm({ user }) {
  const router = useRouter();
  const { login } = useAuth();

  const [firstName, setFirstName] = useState(
    user.firstName || ""
  );

  const [lastName, setLastName] = useState(
    user.lastName || ""
  );

  const [bio, setBio] = useState(user.bio || "");

  const [profileImage, setProfileImage] =
    useState(null);

  const [previewUrl, setPreviewUrl] = useState(
    user.profileImage || null
  );

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!profileImage) {
      setPreviewUrl(user.profileImage || null);
      return;
    }

    const objectUrl =
      URL.createObjectURL(profileImage);

    setPreviewUrl(objectUrl);

    return () => {
      URL.revokeObjectURL(objectUrl);
    };
  }, [profileImage, user.profileImage]);

  const initials =
    `${firstName?.charAt(0) || ""}${lastName?.charAt(0) || ""}`.toUpperCase();

  const handleImageChange = (event) => {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    setProfileImage(file);
    setError("");
  };

  const handleRemoveSelectedImage = () => {
    setProfileImage(null);

    const input =
      document.getElementById("profileImage");

    if (input) {
      input.value = "";
    }

    setPreviewUrl(user.profileImage || null);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    setError("");

    if (!firstName.trim() || !lastName.trim()) {
      setError(
        "First name and last name are required."
      );

      return;
    }

    setLoading(true);

    try {
      const formData = new FormData();

      formData.append(
        "firstName",
        firstName.trim()
      );

      formData.append(
        "lastName",
        lastName.trim()
      );

      formData.append("bio", bio.trim());

      if (profileImage) {
        formData.append(
          "profileImage",
          profileImage
        );
      }

      const response = await fetch(
        "/api/auth/profile",
        {
          method: "PUT",
          body: formData,
        }
      );

      const result = await response.json();

      if (!response.ok) {
        setError(
          result.message ||
            "Unable to update profile"
        );

        return;
      }

      login(result.data);

      router.push("/profile");
      router.refresh();
    } catch (error) {
      setError(
        "Something went wrong. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.form}>
      {error && (
        <div className={styles.errorBox}>
          <strong>Unable to update profile</strong>

          <span>{error}</span>
        </div>
      )}

      {/* Profile image */}
      <section className={styles.section}>
        <div className={styles.sectionHeader}>
          <div>
            <h3>Profile photo</h3>

            <p>
              Choose an image that represents your
              account.
            </p>
          </div>

          <FiCamera
            size={19}
            className={styles.sectionIcon}
          />
        </div>

        <div className={styles.profilePhotoArea}>
          <div className={styles.avatar}>
            {previewUrl ? (
              <img
                src={previewUrl}
                alt={`${firstName} ${lastName}`}
              />
            ) : (
              <span>
                {initials || <FiUser size={28} />}
              </span>
            )}
          </div>

          <div className={styles.photoContent}>
            <label
              htmlFor="profileImage"
              className={styles.uploadButton}
            >
              <FiImage size={15} />
              Choose image
            </label>

            <input
              id="profileImage"
              type="file"
              accept="image/*"
              className={styles.fileInput}
              onChange={handleImageChange}
              disabled={loading}
            />

            <p>
              JPG, PNG or other supported image formats.
            </p>

            {profileImage && (
              <button
                type="button"
                className={styles.removeImage}
                onClick={
                  handleRemoveSelectedImage
                }
                disabled={loading}
              >
                <FiX size={13} />
                Remove selected image
              </button>
            )}
          </div>
        </div>
      </section>

      <div className={styles.divider} />

      {/* Personal information */}
      <section className={styles.section}>
        <div className={styles.sectionHeader}>
          <div>
            <h3>Personal information</h3>

            <p>
              Update the basic information shown on
              your profile.
            </p>
          </div>

          <FiUser
            size={19}
            className={styles.sectionIcon}
          />
        </div>

        <div className={styles.gridTwo}>
          <div className={styles.field}>
            <label htmlFor="firstName">
              First name
            </label>

            <input
              id="firstName"
              type="text"
              value={firstName}
              onChange={(event) =>
                setFirstName(
                  event.target.value
                )
              }
              placeholder="Enter your first name"
              disabled={loading}
            />
          </div>

          <div className={styles.field}>
            <label htmlFor="lastName">
              Last name
            </label>

            <input
              id="lastName"
              type="text"
              value={lastName}
              onChange={(event) =>
                setLastName(
                  event.target.value
                )
              }
              placeholder="Enter your last name"
              disabled={loading}
            />
          </div>
        </div>

        <div className={styles.field}>
          <label htmlFor="bio">
            Bio
          </label>

          <textarea
            id="bio"
            rows={4}
            maxLength={300}
            value={bio}
            onChange={(event) =>
              setBio(event.target.value)
            }
            placeholder="Tell something about yourself..."
            disabled={loading}
          />

          <span className={styles.helper}>
            {bio.length}/300 characters
          </span>
        </div>
      </section>

      <div className={styles.divider} />

      {/* Account information */}
      <section className={styles.section}>
        <div className={styles.sectionHeader}>
          <div>
            <h3>Account information</h3>

            <p>
              These details are managed by your
              ProductHub account.
            </p>
          </div>

          <FiShield
            size={19}
            className={styles.sectionIcon}
          />
        </div>

        <div className={styles.gridTwo}>
          <div className={styles.field}>
            <label htmlFor="email">
              Email address
            </label>

            <div className={styles.disabledInput}>
              <FiMail size={15} />

              <input
                id="email"
                type="email"
                value={user.email}
                disabled
                readOnly
              />
            </div>

            <span className={styles.helper}>
              Email cannot be changed here.
            </span>
          </div>

          <div className={styles.field}>
            <label htmlFor="role">
              Account type
            </label>

            <div className={styles.disabledInput}>
              <FiShield size={15} />

              <input
                id="role"
                type="text"
                value={user.role}
                disabled
                readOnly
              />
            </div>
          </div>
        </div>
      </section>

      {/* Actions */}
      <div className={styles.actions}>
        <button
          type="button"
          className={styles.cancelButton}
          onClick={() => router.back()}
          disabled={loading}
        >
          <FiX size={15} />
          Cancel
        </button>

        <button
          type="submit"
          className={styles.saveButton}
          onClick={handleSubmit}
          disabled={loading}
        >
          {loading ? (
            <>
              <FiLoader
                size={16}
                className={styles.spinner}
              />
              Saving...
            </>
          ) : (
            <>
              <FiCheck size={16} />
              Save changes
            </>
          )}
        </button>
      </div>
    </div>
  );
}