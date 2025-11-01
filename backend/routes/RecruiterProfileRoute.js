const express = require("express");
const router = express.Router();
const supabase = require("../config/supabaseClient");
const authenticateToken = require("../middleware/authenticationToken");
const requireRecruiter = require("../middleware/requireRecruiter");

router.use(authenticateToken, requireRecruiter);

function normalizeAddress(socialLinks) {
  if (!socialLinks || typeof socialLinks !== "object") {
    return {};
  }

  const address = socialLinks.address || {};
  return {
    address_line1: address.line1 || "",
    address_line2: address.line2 || "",
    city: address.city || "",
    state_province: address.state_province || "",
    country: address.country || "",
    postal_code: address.postal_code || "",
  };
}

function buildProfileResponse(profile, company) {
  if (!profile) {
    return null;
  }

  const address = normalizeAddress(company?.social_links);

  return {
    recruiter_id: profile.recruiter_id,
    company_id: company?.company_id || null,
    recruiter_full_name: profile.full_name || "",
    recruiter_designation: profile.designation || "",
    linkedin_url: profile.linkedin_url || "",
    about: profile.about || company?.description || "",
    company_name: company?.name || "",
    industry: company?.industry || "",
    company_size: company?.employee_count_range || "",
    company_email: profile.contact_email || "",
    company_phone: profile.contact_phone || "",
    company_website: company?.website || "",
    logo_url: company?.logo_url || "",
    company_description: company?.description || "",
    founded_year: company?.founded_year || "",
    address_line1: address.address_line1,
    address_line2: address.address_line2,
    city: address.city,
    state_province: address.state_province,
    country: address.country,
    postal_code: address.postal_code,
    headline: company?.headline || "",
    social_links: company?.social_links || {},
    updated_at: profile.updated_at,
  };
}

async function fetchCompany(companyId) {
  if (!companyId) {
    return { data: null, error: null };
  }

  return supabase
    .from("partner_companies")
    .select("*")
    .eq("company_id", companyId)
    .maybeSingle();
}

router.get("/", async (req, res) => {
  try {
    const recruiterId = req.user.id;
    const { data: profile, error: profileError } = await supabase
      .from("recruiter_profiles")
      .select("*")
      .eq("recruiter_id", recruiterId)
      .maybeSingle();

    if (profileError) {
      throw profileError;
    }

    if (!profile) {
      return res.status(404).json({ message: "Recruiter profile not found" });
    }

    const { data: company, error: companyError } = await fetchCompany(profile.company_id);

    if (companyError) {
      throw companyError;
    }

    return res.status(200).json({
      message: "Recruiter profile retrieved",
      data: buildProfileResponse(profile, company),
    });
  } catch (error) {
    console.error("Error fetching recruiter profile:", error);
    return res.status(500).json({ message: "Failed to fetch recruiter profile" });
  }
});

router.put("/", async (req, res) => {
  const recruiterId = req.user.id;
  const payload = { ...req.body };

  if (!payload.company_name || !payload.company_name.trim()) {
    return res.status(400).json({ message: "company_name is required" });
  }

  if (!payload.industry) {
    return res.status(400).json({ message: "industry is required" });
  }

  if (!payload.company_email || !payload.company_phone) {
    return res.status(400).json({ message: "company_email and company_phone are required" });
  }

  if (payload.founded_year && Number.isNaN(Number(payload.founded_year))) {
    return res.status(400).json({ message: "founded_year must be numeric" });
  }

  try {
    const { data: existingProfile, error: profileError } = await supabase
      .from("recruiter_profiles")
      .select("*")
      .eq("recruiter_id", recruiterId)
      .maybeSingle();

    if (profileError) {
      throw profileError;
    }

    let companyId = existingProfile?.company_id || payload.company_id || null;
    let companyRecord = null;

    const addressJson = {
      line1: payload.address_line1 || "",
      line2: payload.address_line2 || "",
      city: payload.city || "",
      state_province: payload.state_province || "",
      postal_code: payload.postal_code || "",
      country: payload.country || "",
    };

    const companyPayload = {
      name: payload.company_name.trim(),
      industry: payload.industry || null,
      employee_count_range: payload.company_size || null,
      website: payload.company_website || null,
      logo_url: payload.logo_url || null,
      description: payload.company_description || payload.about || null,
      founded_year: payload.founded_year ? Number(payload.founded_year) : null,
      social_links: {
        ...(payload.social_links || {}),
        address: addressJson,
      },
      headline: payload.headline || null,
      updated_at: new Date().toISOString(),
    };

    if (existingProfile?.company_id) {
      const { data, error } = await supabase
        .from("partner_companies")
        .update(companyPayload)
        .eq("company_id", existingProfile.company_id)
        .select("*")
        .maybeSingle();

      if (error) {
        throw error;
      }

      companyId = data?.company_id || existingProfile.company_id;
      companyRecord = data || null;
    } else {
      const { data, error } = await supabase
        .from("partner_companies")
        .insert([
          {
            ...companyPayload,
            created_by: recruiterId,
          },
        ])
        .select("*")
        .single();

      if (error) {
        throw error;
      }

      companyId = data.company_id;
      companyRecord = data;
    }

    const profilePayload = {
      recruiter_id: recruiterId,
      company_id: companyId,
      full_name: payload.recruiter_full_name || null,
      designation: payload.recruiter_designation || null,
      contact_email: payload.company_email,
      contact_phone: payload.company_phone,
      about: payload.company_description || payload.about || null,
      linkedin_url: payload.linkedin_url || null,
      updated_at: new Date().toISOString(),
    };

    const { data: upsertedProfile, error: upsertError } = await supabase
      .from("recruiter_profiles")
      .upsert([profilePayload], { onConflict: "recruiter_id" })
      .select("*")
      .single();

    if (upsertError) {
      throw upsertError;
    }

    const companyData = companyRecord || (await fetchCompany(companyId)).data;

    return res.status(201).json({
      message: "Recruiter profile saved successfully",
      data: buildProfileResponse(upsertedProfile, companyData),
    });
  } catch (error) {
    console.error("Error saving recruiter profile:", error);
    return res.status(500).json({ message: "Failed to save recruiter profile" });
  }
});

module.exports = router;
